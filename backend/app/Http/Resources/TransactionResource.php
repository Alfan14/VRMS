<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'member_id' => $this->member_id,
            'member' => new MemberResource($this->whenLoaded('member')),
            'total_amount' => number_format((float) $this->total_amount, 2, '.', ''),
            'payment_method' => $this->payment_method,
            'is_synced' => (bool) $this->is_synced,
            'created_at' => $this->created_at?->toIso8601String(),
            'details' => TransactionDetailResource::collection($this->whenLoaded('details')),
        ];
    }
}
