<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //Create test user
        $user = \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@user.it',
            'password' => bcrypt('password'),
        ]);
        $user->save();

        //Create test users
        $users = \App\Models\User::factory()->count(200)->create();
    }
}
