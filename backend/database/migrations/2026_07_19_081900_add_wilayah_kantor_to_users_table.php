<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->foreignUuid('wilayah_id')
                ->nullable()
                ->after('role');

            $table->foreignUuid('kantor_id')
                ->nullable()
                ->after('wilayah_id');

            $table->foreign('wilayah_id')
                ->references('id')
                ->on('wilayah')
                ->nullOnDelete();

            $table->foreign('kantor_id')
                ->references('id')
                ->on('kantor')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropForeign(['wilayah_id']);
            $table->dropForeign(['kantor_id']);

            $table->dropColumn([
                'wilayah_id',
                'kantor_id'
            ]);
        });
    }
};
