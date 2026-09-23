<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('reservasi_id')->constrained('reservasi_kendaraan')->cascadeOnDelete();
            $table->unsignedTinyInteger('level');
            $table->foreignUuid('approver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('PENDING');
            $table->text('catatan')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index([
                'reservasi_id',
                'level'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
