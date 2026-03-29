<?php
namespace App\Services\ImageStorage;

use GuzzleHttp\Client;
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
