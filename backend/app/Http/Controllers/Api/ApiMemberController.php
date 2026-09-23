<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MemberCollection;
use App\Http\Resources\MemberResource;
use App\Models\Member;
use Illuminate\Http\Request;

class ApiMemberController extends Controller
{
    public function index()
    {
        $members = Member::all();
        return new MemberCollection($members);
    }

    public function show($id)
    {
        $member = Member::findOrFail($id);
        return new MemberResource($member);
    }

    public function create()
    {
        $members = Member::all();
        return view('members.create');
    }
    public function store(Request $request)
    {
        $member = new Member();
        $member->name = $request->input('name');
        $member->phone = $request->input('phone');
        $member->points = $request->input('points');
        $member->save();

        return response()->json(
        ['message' => 'Member created successfully'],201
        );
    }

    public function edit($id)
    {
        $member = Member::findOrFail($id); // Mengambil data buku berdasarkan ID
        return view('members.edit', ['book' => $member]);
    }

    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);
        $member->name = $request->input('name');
        $member->phone = $request->input('phone');
        $member->points = $request->input('points');
        $member->save();

        return response()->json(
            ['message' => 'Member updated successfully'],200
        );
    }

    public function destroy($id)
    {
        $member = Member::findOrFail($id);
        $member->delete();

        return response()->json(
            ['message' => 'Member deleted successfully'],201
        );
    }
}
