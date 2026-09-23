<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kendaraan', function (Blueprint $table) {

            $table->uuid('id')->primary();
            $table->foreignUuid('kantor_id')->constrained('kantor')->cascadeOnDelete();

            $table->string('kode_kendaraan')->unique();
            $table->string('plat_nomor')->unique();
            $table->string('merk');
            $table->string('tipe');
            $table->year('tahun');
            $table->string('warna')->nullable();
            $table->integer('kapasitas_penumpang')->default(1);
            $table->string('status')->default('AVAILABLE');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
