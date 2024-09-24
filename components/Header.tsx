import { Package2 } from "lucide-react";
import Link from "next/link";
import { TxnSearchInput } from "./TxnSearchInput";

export const Header = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-black px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <div> SolSearcher </div>
        </Link>
      </nav>

      <div className="flex w-full items-center justify-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="w-full ml-48 mr-64">
            <TxnSearchInput />
        </div>
      </div>
    </header>
  );
};
