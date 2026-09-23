<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengemudi', function (Blueprint $table) {

            $table->uuid('id')->primary();

            $table->foreignUuid('kantor_id')->constrained('kantor')->cascadeOnDelete();
            $table->string('nama');
            $table->string('no_hp');
            $table->string('sim_nomor');
            $table->date('sim_expired');
            $table->string('status')->default('AVAILABLE');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengemudi');
    }
};
