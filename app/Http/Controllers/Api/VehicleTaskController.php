<?php

namespace App\Http\Controllers\Api;
use App\Models\VehicleTask;
use App\Models\vehicle;
use App\Models\user;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreVehicleTaskRequest;
use App\Http\Requests\UpdateVehicleTaskRequest;
use App\Http\Resources\VehicleTaskResource;
class VehicleTaskController extends Controller
{
    public function index()
    {
        $vehicleTasks = VehicleTask::with(['vehicle', 'user'])->get();
        return VehicleTaskResource::collection($vehicleTasks);
    }
    public function store(StoreVehicleTaskRequest $request)
    {
        $vehicleTasks = VehicleTask::create($request->validated());
        return response()->json($vehicleTasks, Response::HTTP_CREATED);
    }
      // Display the specified task
      public function show(VehicleTask $vehicleTasks)
      {
          return response()->json($vehicleTasks);
      }

      // Update the specified task
      public function update(UpdateVehicleTaskRequest $request, $id)
      {
          $vehicleTask = VehicleTask::findOrFail($id);
          $vehicleTask->update($request->validated());
          return new VehicleTaskResource($vehicleTask);
      }
       // Remove the specified task from storage
       public function destroy(VehicleTask $vehicleTasks)
       {
           $vehicleTasks->delete();
           return response()->json(null, Response::HTTP_NO_CONTENT);
       }
}
