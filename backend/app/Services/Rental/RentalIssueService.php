<?php

namespace App\Services\Rental;

use App\Models\RentalIssue;

class RentalIssueService
{
    public function create(array $data): RentalIssue
    {
        return RentalIssue::create($data);
    }

    public function update(int $id, array $data): RentalIssue
    {
        $issue = RentalIssue::query()->findOrFail($id);
        $issue->fill($data)->save();

        return $issue;
    }
}
