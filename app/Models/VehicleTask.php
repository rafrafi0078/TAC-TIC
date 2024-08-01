<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleTask extends Model
{
    use HasFactory;
    protected $fillable = [
        'start_date',
        'end_date',
        'vehicle_id',
        'user_id',
        'status',
        'start_point',
        'end_point',
        'description',
        
     
    ];
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
