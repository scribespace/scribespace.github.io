import { LayoutPlugin } from "./layoutPlugin";
import { TableLayoutCommandsPlugin } from "./tableLayoutCommandsPlugin/tableLayoutCommandsPlugin";
import TablePlugin from "./tablePlugin";

export function TableLayoutPlugin() {
    return (
        <>
            <TablePlugin/>
            <LayoutPlugin/>
            <TableLayoutCommandsPlugin/>
        </>
    );
}