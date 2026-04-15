// @ts-ignore
import React, {useEffect, useRef, useState} from "react";

export function ServerTerminal() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    function appendLine(text: string, type?: "success") {
        if (!containerRef.current) return;

        const pre = document.createElement("pre");
        pre.setAttribute("data-prefix", ">");

        if (type === "success") {
            pre.classList.add("text-success");
        }

        const code = document.createElement("code");
        code.textContent = text;

        pre.appendChild(code);
        containerRef.current.appendChild(pre);

        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    let currentJob;

    useEffect(() => {
        const backendOrigin = "http://127.0.0.1:8000";
        const wsUrl = `${backendOrigin.replace(/^http/, "ws")}/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            let data;

            try {
                data = JSON.parse(event.data);
            } catch {
                data = {message: event.data};
            }

            currentJob = data.job_id;

            if (data.message === "TRAINING_COMPLETE") {
                appendLine("✅ Training finished!", "success");
                return;
            }

            appendLine(data.message);
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        socket.onclose = () => {
            appendLine("Connection closed.");
        };

        return () => {
            socket.close();
        };
    }, []);


    return (
        <>
            <h3>{currentJob}</h3>
            <div className="mockup-code w-full h-160" ref={containerRef}>
                <pre data-prefix="$" className="text-primary">
                  <code>Waiting for training to begin...</code>
                </pre>
            </div>
        </>
    );
}
