import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./Table/table";
import { TableHeader } from "./Table/table-header";
import { TableCell } from "./Table/table-cell";
import { TableRow } from "./Table/table-row";
import { ChangeEvent, useState } from "react";
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale(ptBR);

import { attendees } from "../data/attendees";

export function AttendeeList() {
    const [ search, setSearch ] = useState(() => {
        const url = new URL(window.location.toString());

        if (url.searchParams.has('search'))
            return url.searchParams.get('search') ?? '';

        return ''
    });

    const [ page, setPage ] = useState(() => {
        const url = new URL(window.location.toString());

        if (url.searchParams.has('page'))
            return Number(url.searchParams.get('page'));

        return 1
    });

    
    const filteredAttendee = attendees.filter(attendee => attendee.name
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()))
        
    const totalPages = Math.ceil(filteredAttendee.length / 10);

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString());
        
        url.searchParams.set('search', search);
        window.history.pushState({}, "", url);
        setSearch(search);
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString());
        
        url.searchParams.set('page', String(page ));
        window.history.pushState({}, "", url);
        setPage(page);
    }

    function handleChangeSearch(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;

        setCurrentPage(1);
        setCurrentSearch(value)
    }

    function handleGoToFirstPage() {
        setCurrentPage(1)
    }

    function handleGoToNextPage() {
        setCurrentPage(page + 1);
    }

    function handleGoToPreviousPage() {
        setCurrentPage(page - 1);
    }

    function handleGoToLastPage() {
        setCurrentPage(totalPages);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>

                <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <Search 
                        className="size-4 text-emerald-300" 
                    />

                    <input
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
                        placeholder="Buscar participante..."
                        type="text" 
                        value={search}
                        onChange={handleChangeSearch}
                    />
                </div>
            </div>
            
            <Table>
                <thead>
                    <TableRow>
                        <TableHeader style={{width: '48px'}}>
                            <input className="size-4 bg-black/20 rounded border-white/10 " type="checkbox" />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{width: '64px'}}></TableHeader>
                    </TableRow>
                </thead>

                <tbody>
                    {filteredAttendee.slice((page - 1) * 10, page * 10).map(attendee => 
                    <TableRow key={attendee.id}>
                        <TableCell>
                            <input className="size-4 bg-black/20 rounded border-white/10 " type="checkbox" />
                        </TableCell>
                        <TableCell>{attendee.id}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-white">{attendee.name}</span>
                                <span>{attendee.email}</span>
                            </div>
                        </TableCell>
                        <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                        <TableCell>
                            { attendee.checkedInAt === null 
                            ? <span className="text-zinc-400">Não fex check-in</span>
                            : dayjs().to(attendee.checkedInAt)}
                        </TableCell>
                        <TableCell>
                            <IconButton transparent>
                                <MoreHorizontal className="size-4"/>
                            </IconButton>
                        </TableCell>
                    </TableRow>)}
                </tbody>

                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando { filteredAttendee.length < 10 ? filteredAttendee.length : page * 10 } de { filteredAttendee.length } itens
                        </TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span>Página { page } de { totalPages }</span>

                                <div className="flex gap-1.5">
                                    <IconButton 
                                        onClick={handleGoToFirstPage}
                                        disabled={page === 1}
                                    >
                                        <ChevronsLeft className="size-4"/>
                                    </IconButton>

                                    <IconButton 
                                        onClick={handleGoToPreviousPage}
                                        disabled={page === 1}
                                    >
                                        <ChevronLeft className="size-4"/>
                                    </IconButton>
                                    
                                    <IconButton 
                                        onClick={handleGoToNextPage}
                                        disabled={page === totalPages}
                                    >
                                        <ChevronRight className="size-4"/>
                                    </IconButton>

                                    <IconButton 
                                        onClick={handleGoToLastPage}
                                        disabled={page === totalPages}
                                    >
                                        <ChevronsRight className="size-4"/>
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}