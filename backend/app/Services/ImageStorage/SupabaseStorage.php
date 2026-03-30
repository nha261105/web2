<?php
namespace App\Services\ImageStorage;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use RuntimeException;

class SupabaseStorage
{
    public function uploadFromUrl(
        string $url,
        string $pathPrefix = 'products',
    ): string {
        $client = new Client(['http_errors' => true, 'timeout' => 20]);
        $resp = $client->get($url);
        $content = $resp->getBody()->getContents();
        $contentType =
            $resp->getHeaderLine('Content-Type') ?: 'application/octet-stream';

        $filename =
            Str::slug(
                pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_FILENAME) ?:
                'img',
            ) .
            '-' .
            uniqid() .
            '.' .
            ($this->guessExtension($contentType) ?? 'bin');

        $path = trim($pathPrefix, '/') . '/' . $filename;

        $putUrl =
            rtrim(config('services.supabase.url'), '/') .
            '/storage/v1/object/' .
            config('services.supabase.bucket') .
            "/{$path}";

        $client->request('PUT', $putUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . config('services.supabase.key'),
                'Content-Type' => $contentType,
                'x-upsert' => 'false',
            ],
            'body' => $content,
        ]);

        return rtrim(config('services.supabase.url'), '/') .
            '/storage/v1/object/public/' .
            config('services.supabase.bucket') .
            "/{$path}";
    }

    public function toAccessibleUrl(string $url, int $expiresIn = 3600): string
    {
        if (!str_contains($url, '/storage/v1/object/public/')) {
            return $url;
        }

        $cacheKey = 'supabase:signed-url:' . sha1($url . '|' . $expiresIn);
        $cacheTtl = max(60, $expiresIn - 120);

        return Cache::remember($cacheKey, $cacheTtl, function () use ($url, $expiresIn) {
            return $this->signPublicObjectUrl($url, $expiresIn);
        });
    }

    private function signPublicObjectUrl(string $url, int $expiresIn): string
    {
        if (!str_contains($url, '/storage/v1/object/public/')) {
            return $url;
        }

        $parsedPath = parse_url($url, PHP_URL_PATH);
        if (!is_string($parsedPath)) {
            return $url;
        }

        if (!preg_match('#/storage/v1/object/public/([^/]+)/(.+)$#', $parsedPath, $matches)) {
            return $url;
        }

        $bucket = $matches[1];
        $objectPath = $matches[2];
        $baseUrl = rtrim((string) config('services.supabase.url'), '/');

        try {
            $client = new Client(['http_errors' => true, 'timeout' => 20]);
            $resp = $client->request('POST', $baseUrl . '/storage/v1/object/sign/' . $bucket . '/' . $objectPath, [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('services.supabase.key'),
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'expiresIn' => $expiresIn,
                ],
            ]);

            $payload = json_decode((string) $resp->getBody(), true);
            $signedPath = $payload['signedURL'] ?? $payload['signedUrl'] ?? null;

            if (!is_string($signedPath) || $signedPath === '') {
                return $url;
            }

            if (!str_starts_with($signedPath, '/')) {
                $signedPath = '/' . $signedPath;
            }

            return $baseUrl . '/storage/v1' . $signedPath;
        } catch (\Throwable) {
            return $url;
        }
    }

    private function guessExtension(string $contentType): ?string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
        ];
        return $map[$contentType] ?? null;
    }
}
