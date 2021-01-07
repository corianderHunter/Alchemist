
const downloadFile = (blob: any, filename = "", headers: any = {}) => {
    if (!filename) {
        const disposition = headers["Content-Disposition"];
        if (disposition && disposition.indexOf("attachment") !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1])
                filename = matches[1].replace(/['"]/g, "");
        }
    }
    const URL = window.URL || window.webkitURL;
    const downloadUrl = URL.createObjectURL(blob);
    if (filename) {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        (window as any).location = downloadUrl;
    }
}

export default downloadFile;