<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_service', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->foreignUuid('kendaraan_id')->constrained('kendaraan')->cascadeOnDelete();
            $table->date('tanggal_service');
            $table->string('jenis_service');
            $table->string('vendor')->nullable();
            $table->decimal('biaya', 15, 2)->default(0);
            $table->string('status')->default('SCHEDULED');
            $table->text('keterangan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_service');
    }
};
