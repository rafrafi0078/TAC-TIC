<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Vehicle;
class VehicleSeeder extends Seeder
{
    public function run()
    {
       

        // Inserting a single record
        Vehicle::create([
            'make' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2020,
            'registration_number' => 'ABC123',
            'fuel_card_number' => '1234567890',
            'insurance_payment_due_date' => now(),
            'tax_payment_due_date' => now(),
            'position' => json_encode(['lat' => 36.7783, 'lng' => -119.4179]),
        ]);

        // Inserting multiple records at once
        Vehicle::insert([
            [
                'make' => 'Honda',
                'model' => 'Civic',
                'year' => 2019,
                'registration_number' => 'XYZ789',
                'fuel_card_number' => '2345678901',
                'insurance_payment_due_date' => now()->addYear(),
                'tax_payment_due_date' => now()->addMonths(6),
                'position' => json_encode(['lat' => 37.7749, 'lng' => -122.4194]),
            ],
            [
                'make' => 'Ford',
                'model' => 'Focus',
                'year' => 2018,
                'registration_number' => 'LMN456',
                'fuel_card_number' => '3456789012',
                'insurance_payment_due_date' => now()->addYear(1),
                'tax_payment_due_date' => now()->addMonths(6),
                'position' => json_encode(['lat' => 34.0522, 'lng' => -118.2437]),
            ],
            // Add more vehicles as needed
        ]);
    }
}
