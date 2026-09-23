<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        Schema::create('penggunaan_kendaraan', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->foreignUuid('reservasi_id')->constrained('reservasi_kendaraan');
            $table->integer('odometer_awal');
            $table->integer('odometer_akhir')->nullable();
            $table->dateTime('tanggal_berangkat');
            $table->dateTime('tanggal_kembali')->nullable();
            $table->text('catatan')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penggunaan_kendaraan');
    }
};
