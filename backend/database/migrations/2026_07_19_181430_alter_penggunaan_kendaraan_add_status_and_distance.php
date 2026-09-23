<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('penggunaan_kendaraan', function (Blueprint $table) {

            $table->string('status')
                ->default('IN_PROGRESS')
                ->after('catatan');

            $table->integer('jarak_tempuh')
                ->nullable()
                ->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('penggunaan_kendaraan', function (Blueprint $table) {

            $table->dropColumn([
                'status',
                'jarak_tempuh'
            ]);
        });
    }
};
