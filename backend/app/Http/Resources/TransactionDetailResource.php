<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'qty' => $this->qty,
            'price_at_sale' => number_format((float) $this->price_at_sale, 2, '.', ''),
            'subtotal' => number_format((float) $this->subtotal, 2, '.', ''),
        ];
    }
}
