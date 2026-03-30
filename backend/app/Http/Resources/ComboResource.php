<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComboResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'daily_price' => $this->daily_price,
            'description' => $this->description,
            'items' => ComboDetailResource::collection(
                $this->whenLoaded('comboDetails'),
            ),
        ];
    }
}
