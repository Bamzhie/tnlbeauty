import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientDetail } from "../types";

interface ClientListTableProps {
  clients: ClientDetail[];
  show: boolean;
}

export const ClientListTable: React.FC<ClientListTableProps> = ({
  clients,
  show,
}) => {
  if (!show) return null;

  return (
    <Card className="mb-4 sm:mb-8 shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-blue-900 text-base sm:text-lg">
          Client List
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-3 py-2 border">Client ID</th>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Service</th>
                <th className="px-3 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50">
                  <td className="border px-3 py-2 text-center">{c.id}</td>
                  <td className="border px-3 py-2 text-center">{c.name}</td>
                  <td className="border px-3 py-2 text-center">{c.service}</td>
                  <td className="border px-3 py-2 text-center">
                    £{c.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
