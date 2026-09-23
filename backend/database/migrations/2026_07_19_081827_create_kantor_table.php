<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kantor', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('wilayah_id')->constrained('wilayah')->cascadeOnDelete();

            $table->string('kode_kantor')->unique();
            $table->string('nama_kantor');

            $table->text('alamat')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kantor');
    }
};
