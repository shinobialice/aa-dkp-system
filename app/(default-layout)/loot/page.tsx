"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export default function ExampleTable() {
  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 px-2"
                onClick={() => console.log("Sort by Username")}
              >
                Username
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>koplialice</TableCell>
            <TableCell>koplialice@example.com</TableCell>
            <TableCell>Leader</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>someone</TableCell>
            <TableCell>someone@example.com</TableCell>
            <TableCell>Member</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
