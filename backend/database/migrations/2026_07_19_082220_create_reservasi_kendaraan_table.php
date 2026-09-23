<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservasi_kendaraan', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->string('nomor_reservasi')->unique();
            $table->foreignUuid('kendaraan_id')->constrained('kendaraan');
            $table->foreignUuid('pengemudi_id')->nullable()->constrained('pengemudi');
            $table->foreignUuid('pemohon_id')->constrained('users');
            $table->dateTime('tanggal_mulai');
            $table->dateTime('tanggal_selesai');
            $table->string('tujuan');
            $table->text('keperluan');
            $table->string('status')->default('PENDING_LV1');
            $table->timestamps();

            $table->index(
     ['kendaraan_id', 'tanggal_mulai', 'tanggal_selesai'],
        'idx_reservation_vehicle'
            );

            $table->index(
     ['pengemudi_id', 'tanggal_mulai', 'tanggal_selesai'],
        'idx_reservation_driver'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservasi_kendaraan');
    }
};
