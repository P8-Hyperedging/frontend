// Source - https://stackoverflow.com/a/61710898
// Posted by Marcos Casagrande, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-09, License - CC BY-SA 4.0


export async function runTrainPy() {
    const scriptPath = new URL("../../HGCNN/nn/train.py", import.meta.url).pathname;
    const pythonPath = new URL("../../HGCNN/.venv/bin/python", import.meta.url).pathname;
    const projectRoot = new URL("../../HGCNN", import.meta.url).pathname;

    const command = new Deno.Command(pythonPath, {
        args: [scriptPath],
        cwd: projectRoot,
        stdout: "piped",
        stderr: "piped",
    });

    const { stdout, stderr } = await command.output();

    console.log(new TextDecoder().decode(stdout));
    console.log(new TextDecoder().decode(stderr));
}