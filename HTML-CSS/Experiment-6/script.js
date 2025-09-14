class DrawingTool {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.isDrawing = false;
        this.currentPath = null;
        
        this.init();
    }
    
    init() {
        // Add mouse event listeners
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        
        // Create a new path element for freehand drawing
        this.currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.currentPath.setAttribute('fill', 'none');
        this.currentPath.setAttribute('stroke', '#000000');
        this.currentPath.setAttribute('stroke-width', '2');
        this.currentPath.setAttribute('d', `M ${pos.x} ${pos.y}`);
        
        this.canvas.appendChild(this.currentPath);
    }
    
    draw(e) {
        if (!this.isDrawing || !this.currentPath) return;
        
        const pos = this.getMousePos(e);
        
        // Add a line segment to the current path
        const currentD = this.currentPath.getAttribute('d');
        this.currentPath.setAttribute('d', currentD + ` L ${pos.x} ${pos.y}`);
    }
    
    stopDrawing() {
        this.isDrawing = false;
        this.currentPath = null;
    }
}

// Initialize the drawing tool when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DrawingTool();
});
