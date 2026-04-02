function TableBody({columns, data, idField, onSelect}) {

    const handleSelect = () => {
        
    }

    return (
        <tbody>
            {data.map((row) => {
                return (
                    <tr key={row.id}>
                        {columns.map(({ accessor }) => {
                            const tData = row[accessor] ? row[accessor] : "——";
                            return <td key={accessor}>{tData}</td>;
                        })}
                        <td>
                            <button type="button" onClick={() => onSelect(row[idField])}>
                                Select
                            </button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    )
}

export default TableBody;