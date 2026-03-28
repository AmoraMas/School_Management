function TableBody({columns, data}) {
    return (
        <tbody>
            {data.map((data) => {
                return (
                    <tr key={data.id}>
                        {columns.map(({ accessor }) => {
                            const tData = data[accessor] ? data[accessor] : "——";
                            return <td key={accessor}>{tData}</td>;
                        })}
                    </tr>
                );
            })}
        </tbody>
    )
}

export default TableBody;