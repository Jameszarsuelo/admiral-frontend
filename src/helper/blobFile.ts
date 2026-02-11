const MIME_BY_EXT: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
};

export function getFileExtension(filename?: string | null): string {
    if (!filename) return "";
    const clean = filename.split("?")[0].split("#")[0];
    const lastDot = clean.lastIndexOf(".");
    if (lastDot === -1 || lastDot === clean.length - 1) return "";
    return clean.slice(lastDot + 1).toLowerCase();
}

export function inferMimeType(filename?: string | null): string | undefined {
    const ext = getFileExtension(filename);
    return ext ? MIME_BY_EXT[ext] : undefined;
}

export function coerceBlobType(blob: Blob, filename?: string | null): Blob {
    const inferred = inferMimeType(filename);
    if (!inferred) return blob;

    // If server already set a good type, keep it.
    if (blob.type && blob.type !== "application/octet-stream") {
        return blob;
    }

    return new Blob([blob], { type: inferred });
}

export function makeObjectUrl(blob: Blob, revokeAfterMs = 60_000): { url: string; revoke: () => void } {
    const url = URL.createObjectURL(blob);
    const revoke = () => {
        try {
            URL.revokeObjectURL(url);
        } catch {
            // ignore
        }
    };

    // Give the browser time to start using the URL (PDFs can be slower).
    if (revokeAfterMs > 0) {
        window.setTimeout(revoke, revokeAfterMs);
    }

    return { url, revoke };
}
