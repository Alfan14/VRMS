<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        return User::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required',
            'role' => 'required|in:superadmin,admin,kasir,manager',
            'password' => 'required',
            'pin' => 'required'
        ]);

        $data['password'] = Hash::make($data['password']);

        return User::create($data);
    }
    

    public function show($id) {
        return User::findOrFail($id);
    }

    public function update(Request $r, $id)
    {
        $u = User::findOrFail($id);

        $u->update($r->validate([
            'username' => 'sometimes',
            'role' => 'sometimes|in:superadmin,admin,kasir,manager',
            'password' => 'nullable|min:6',
            'pin' => 'sometimes'
        ]));

        if ($r->filled('password')) {
            $u->update(['password' => Hash::make($r->password)]);
        }

        return $u;
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->noContent();
    }
}
