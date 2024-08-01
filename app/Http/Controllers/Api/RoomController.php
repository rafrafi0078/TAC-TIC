<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;
use ErlandMuchasaj\LaravelFileUploader\FileUploader;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // All rooms
        $rooms = Room::all();
      
        // Return Json Response
        return response()->json([
           'rooms' => $rooms
        ],200);
    }

 
    public function store(StoreRoomRequest $request)
    {
        \Log::info($request->all());
        try {
            $imageName = Str::random(32).".".$request->image->getClientOriginalExtension();
      
            // Create Room
            Room::create([
                'name' => $request->name,
                'capacity' => $request->capacity,
                'image' => $imageName,
              
               
                'description' => $request->description
            ]);
      
            // Save Image in Storage folder
            Storage::disk('public')->put($imageName, file_get_contents($request->image));
      
            // Return Json Response
            return response()->json([
                'message' => "Room successfully created."
            ],200);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            // Return Json Response
            return response()->json([
                
                'message' => "Something went really wrong!",
                'error' => $e->getMessage()
            ],500);
        }
    }


    public function show($id)
    {
        // Room Detail 
       $room = Room::find($id);
       if(!$room){
         return response()->json([
            'message'=>'room Not Found.'
         ],404);
       }
      
       // Return Json Response
       return response()->json([
          'room' => $room
       ],200);

    }

    public function update(UpdateRoomRequest $request, $id)
    {
        try {
            // Find room
            $room = Room::find($id);
            if(!$room){
              return response()->json([
                'message'=>'room Not Found.'
              ],404);
            }
      
            //echo "request : $request->image";
            $room->name = $request->name;
            $room->capacity = $request->capacity;
            $room->available = $request->available;
            $room->description = $request->description;
      
            if($request->image) {
 
                // Public storage
                $storage = Storage::disk('public');
      
                // Old iamge delete
                if($storage->exists($room->image))
                    $storage->delete($room->image);
      
                // Image name
                $imageName = Str::random(32).".".$request->image->getClientOriginalExtension();
                $room->image = $imageName;
      
                // Image save in public folder
                $storage->put($imageName, file_get_contents($request->image));
            }
      
            // Update room
            $room->save();
      
            // Return Json Response
            return response()->json([
                'message' => "room successfully updated."
            ],200);
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "Something went really wrong!"
            ],500);
        }
    }


    public function destroy($id)
    {
     
        
          // Detail 
          $room = Room::find($id);
          if(!$room){
            return response()->json([
               'message'=>'Room Not Found.'
            ],404);
          }
        
          // Public storage
          $storage = Storage::disk('public');
        
          // Iamge delete
          if($storage->exists($room->image))
              $storage->delete($room->image);
        
          // Delete room
          $room->delete();
        
          return response("", 204);
    }
 
}