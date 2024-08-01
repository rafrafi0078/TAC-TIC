<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\VehicleTaskController;

use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectMemberController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\SocialController;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use ErlandMuchasaj\LaravelFileUploader\FileUploader;
use App\Http\Controllers\FileController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/tasksUser', TaskController::class);
    Route::apiResource('/tasks', TaskController::class);
 
    
    Route::middleware('isAdmin')->group(function () {
        Route::apiResource('/users', UserController::class);
      
        Route::apiResource('/reservations', ReservationController::class);
        Route::apiResource('/vehiculetasks', VehicleTaskController::class);
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::apiResource('/projects', ProjectController::class);
        Route::apiResource('/project-members', ProjectMemberController::class);
        

        Route::apiResource('/vehicles', VehicleController::class);
        
    });

  


});
Route::get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/checkAndAddGoogleUser', [AuthController::class, 'checkAndAddGoogleUser']);
    // visualize the form


Route::get('rooms', [RoomController::class, 'index']); 
Route::get('rooms/{id}', [RoomController::class, 'show']); 
Route::put('/vehiculetask/{id}', [VehicleTaskController::class, 'update']);
Route::post('rooms', [RoomController::class, 'store']); 
Route::put('productsupdate/{id}', [RoomController::class, 'update']);
Route::delete('productdelete/{id}', [RoomController::class, 'destroy']);

