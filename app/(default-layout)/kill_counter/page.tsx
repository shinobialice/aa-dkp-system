"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function KillCounterPage() {
  const [primes, setPrimes] = useState([
    {
      date: "2025-06-20",
      kills: [
        {
          id: 1,
          name: "Player 1",
          honorStart: 100,
          honorEnd: 150,
          killsStart: 10,
          killsEnd: 20,
          primeHonor: 50,
          primeKills: 5,
        },
        {
          id: 2,
          name: "Player 2",
          honorStart: 200,
          honorEnd: 250,
          killsStart: 15,
          killsEnd: 25,
          primeHonor: 60,
          primeKills: 10,
        },
      ],
    },
    {
      date: "2025-06-21",
      kills: [
        {
          id: 3,
          name: "Player 3",
          honorStart: 300,
          honorEnd: 350,
          killsStart: 8,
          killsEnd: 18,
          primeHonor: 40,
          primeKills: 7,
        },
        {
          id: 4,
          name: "Player 4",
          honorStart: 400,
          honorEnd: 450,
          killsStart: 12,
          killsEnd: 22,
          primeHonor: 50,
          primeKills: 8,
        },
      ],
    },
    {
      date: "2025-06-22",
      kills: [
        {
          id: 5,
          name: "Player 5",
          honorStart: 500,
          honorEnd: 550,
          killsStart: 20,
          killsEnd: 30,
          primeHonor: 100,
          primeKills: 15,
        },
      ],
    },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">безполезная фигня</h1>
      <Accordion type="single" collapsible>
        {primes.map((prime) => (
          <AccordionItem key={prime.date} value={prime.date}>
            <AccordionTrigger className="cursor-pointer border p-3">{`Прайм: ${prime.date}`}</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Никнейм</TableHead>
                    <TableHead>Хонор в начале</TableHead>
                    <TableHead>Хонор в конце</TableHead>
                    <TableHead>Килов в начале</TableHead>
                    <TableHead>Килов в конце</TableHead>
                    <TableHead>Хонор за прайм</TableHead>
                    <TableHead>Килов за прайм</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prime.kills.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.honorStart}</TableCell>
                      <TableCell>{player.honorEnd}</TableCell>
                      <TableCell>{player.killsStart}</TableCell>
                      <TableCell>{player.killsEnd}</TableCell>
                      <TableCell>{player.primeHonor}</TableCell>
                      <TableCell>{player.primeKills}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
