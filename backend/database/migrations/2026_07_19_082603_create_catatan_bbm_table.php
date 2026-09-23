<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catatan_bbm', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->foreignUuid('penggunaan_id')->constrained('penggunaan_kendaraan')->cascadeOnDelete();
            $table->date('tanggal');
            $table->decimal('liter', 10, 2);
            $table->decimal('harga_per_liter', 15, 2);
            $table->decimal('total_biaya', 15, 2);
            $table->decimal('harga_per_liter', 15, 2);
            $table->decimal('total_biaya', 15, 2);
            $table->string('spbu');
            $table->text('catatan')->nullable();
            

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catatan_bbm');
    }
};
