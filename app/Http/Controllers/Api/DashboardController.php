<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Models\Task;
use App\Models\VehicleTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    public function index()
    {  
         // Vehicle tasks
        $numberOfVehicleTasksTodo = VehicleTask::where('status', 'ToDo')->count();
        $numberOfVehicleTasksDone = VehicleTask::where('status', 'Completed')->count();
          // General tasks
        $numberOfTasksTodo = Task::where('status', 'ToDo')->count();
        $numberOfTasksDone = Task::where('status', 'Completed')->count();

        $numberOfTProjectTodo = Project::where('status', 'ToDo')->count();
        $numberOfProjectTDone = Project::where('status', 'Completed')->count();
        $numberOfProjectTInReview = Project::where('status', 'InReview')->count();
        $numberOfProjectTBacklog = Project::where('status', 'Backlog')->count();
        
        // Users by group
            $usersByGroup = User::select('group', DB::raw('count(*) as total'))
            ->groupBy('group')
            ->get()
            ->toArray();
        // Combine both counts into a single array for the response
        return response()->json([
            'numberOfTasksDone' => $numberOfTasksDone,
            'numberOfTasksTodo' => $numberOfTasksTodo,
            'numberOfVehicleTasksTodo' => $numberOfVehicleTasksTodo,
            'numberOfVehicleTasksDone' => $numberOfVehicleTasksDone,

            'numberOfTProjectTodo' => $numberOfTProjectTodo,
            'numberOfProjectTDone' => $numberOfProjectTDone,
            'numberOfProjectTInReview' => $numberOfProjectTInReview,
            'numberOfProjectTBacklog' => $numberOfProjectTBacklog,
            'usersByGroup' => $usersByGroup 
        ]);
    }
}
