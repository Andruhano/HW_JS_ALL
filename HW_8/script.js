document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const controlsPanel = document.querySelector('.controls-panel');
    const shapeOptions = document.querySelectorAll('.shape-option');
    const colorOptions = document.querySelectorAll('.color-option');

    let selectedShape = 'square'; 
    let selectedColor = '#000000'; 
    let isDrawing = false;
    let startX, startY;
    let drawnShapes = []; 

    canvas.width = 860;
    canvas.height = 500;

    function drawShape(shape, color, x, y, width, height) {
        ctx.fillStyle = color;
        ctx.beginPath();

        switch (shape) {
            case 'square':
                ctx.rect(x, y, width, height);
                break;
            case 'circle':
                const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                break;
            case 'diamond':
                ctx.moveTo(x + width / 2, y); 
                ctx.lineTo(x + width, y + height / 2); 
                ctx.lineTo(x + width / 2, y + height); 
                ctx.lineTo(x, y + height / 2); 
                ctx.closePath();
                break;
            case 'triangle':
                ctx.moveTo(x + width / 2, y); 
                ctx.lineTo(x + width, y + height); 
                ctx.lineTo(x, y + height); 
                ctx.closePath();
                break;
        }
        ctx.fill();
    }

    function redrawAllShapes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        drawnShapes.forEach(shape => {
            drawShape(shape.type, shape.color, shape.x, shape.y, shape.width, shape.height);
        });
    }

    shapeOptions.forEach(option => {
        option.addEventListener('click', () => {
            shapeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedShape = option.dataset.shape;
        });
    });

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedColor = option.dataset.color;
        });
    });

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = currentX - startX;
        const height = currentY - startY;

        redrawAllShapes(); 
        drawShape(selectedShape, selectedColor, startX, startY, width, height);
    });

    canvas.addEventListener('mouseup', (e) => {
        if (!isDrawing) return;
        isDrawing = false;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = endX - startX;
        const height = endY - startY;

        const minSize = 5;
        if (Math.abs(width) < minSize && Math.abs(height) < minSize) {
             const defaultSize = 50;
             const finalX = startX - defaultSize / 2; 
             const finalY = startY - defaultSize / 2;
             const newShape = {
                 type: selectedShape,
                 color: selectedColor,
                 x: finalX,
                 y: finalY,
                 width: defaultSize,
                 height: defaultSize
             };
             drawnShapes.push(newShape);
        } else {
            const newShape = {
                type: selectedShape,
                color: selectedColor,
                x: startX,
                y: startY,
                width: width,
                height: height
            };
            drawnShapes.push(newShape);
        }

        redrawAllShapes(); 
    });

    canvas.addEventListener('mouseleave', () => {
        if (isDrawing) {
            isDrawing = false;
            redrawAllShapes();
        }
    });

    redrawAllShapes();
});