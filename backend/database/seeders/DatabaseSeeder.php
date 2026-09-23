<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

// Models
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\MemberTier;
use App\Models\Member;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderDetail;
use App\Models\GoodReceipt;
use App\Models\GoodReceiptDetail;
use App\Models\Shift;
use App\Models\ChartOfAccount;

// Services / UseCases
use App\Domain\Inventory\InventoryService;
use App\Application\UseCases\POS\CreateTransactionUseCase;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            WilayahSeeder::class,
            KantorSeeder::class,
            UserSeeder::class,
            KendaraanSeeder::class,
            PengemudiSeeder::class,
        ]);
    }
}
