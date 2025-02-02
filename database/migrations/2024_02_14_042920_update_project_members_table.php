<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_members', function (Blueprint $table) {
            if (!Schema::hasColumn('project_members', 'project_id')) {
                $table->foreignId('project_id')->constrained()->onDelete('cascade');
            }

            if (!Schema::hasColumn('project_members', 'user_id')) {
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
            }

            if (!Schema::hasColumn('project_members', 'role')) {
                $table->string('role')->nullable();
            }

            if (!Schema::hasColumn('project_members', 'start_date')) {
                $table->date('start_date')->nullable();
            }

            if (!Schema::hasColumn('project_members', 'end_date')) {
                $table->date('end_date')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_members', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropColumn('project_id');
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->dropColumn('role');
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
        });
    }
};
