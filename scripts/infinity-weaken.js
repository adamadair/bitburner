export async function main(ns) {
    const data = ns.flags([
        ["target", ""],
        ["stock", false],
        ["sleep", 10000],
        ["id", 0]
    ]);
    if (data.target == "") {
        ns.print("No target provided, exiting now.")
        return;
    }
    ns.printf("weaken id: {d}", data.id);
    while (true) {
        await ns.weaken(data.target, { stock: data.stock });
        await ns.sleep(data.sleep);
    }
}