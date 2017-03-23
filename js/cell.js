var Cell = function(row, col) {

    this.Column = col;
    this.Row = row;
    this.cellType = _NEUTRAL;
    this.wallT = true;
    this.wallR = true;
    this.wallB = true;
    this.wallL = true;
    this.IsVisited = false;

    /* possibly custom maybe prototype it?*/



    this.setCellType = function(t) {
        this.cellType = t;
    }

    this.show = function() {
        strokeWeight(2);        
        fill(this.getCellColour());
        stroke('#333399');
        rect(col * CELL_WIDTH, row * CELL_WIDTH, CELL_WIDTH+1, CELL_WIDTH+1);
        
        if (!this.wallT)
        {
            strokeWeight(3);     
            stroke(this.getCellColour());
            //stroke('green');
            
            line(this.Column * CELL_WIDTH,
                this.Row * CELL_WIDTH,
                this.Column * CELL_WIDTH + CELL_WIDTH,
                this.Row * CELL_WIDTH);
        }
            

        if (!this.wallB)
        {
            strokeWeight(3);     
                stroke(this.getCellColour());
                
                line(this.Column * CELL_WIDTH,
                this.Row * CELL_WIDTH + CELL_WIDTH,
                this.Columncol * CELL_WIDTH + CELL_WIDTH,
                this.Row * CELL_WIDTH + CELL_WIDTH);
        }            

        if (!this.wallR)
        {
            strokeWeight(3);     
            stroke(this.getCellColour());
            line(col * CELL_WIDTH + CELL_WIDTH, row * CELL_WIDTH, col * CELL_WIDTH + CELL_WIDTH, row * CELL_WIDTH + CELL_WIDTH);
        }            

        if (!this.wallL)
        {
         strokeWeight(3);        
            stroke(this.getCellColour());
            line(col * CELL_WIDTH, row * CELL_WIDTH, col * CELL_WIDTH, row * CELL_WIDTH + CELL_WIDTH);
        }         
    }



    this.getUnvisitedNeighbours = function() {
        var n = this.getNeighbours();
        var result = [];
        for (var i = 0; i < n.length; i++) {
            if (!n[i].IsVisited) {
                result.push(n[i]);
            }
        }
        return result;
    }
    this.getNeighbours = function() {
        var result = [];
        //for a square grid
        var n1 = grid[getIndex(this.Row + 1, this.Column)];
        var n2 = grid[getIndex(this.Row - 1, this.Column)];
        var n3 = grid[getIndex(this.Row, this.Column + 1)];
        var n4 = grid[getIndex(this.Row, this.Column - 1)];

        if (n1)
            result.push(n1);
        if (n2)
            result.push(n2);
        if (n3)
            result.push(n3);
        if (n4)
            result.push(n4);

        return result;
    }

    this.getCellColour = function() {
        switch (this.cellType) {
            case _NEUTRAL:
                return '#cc6699';
            case _VISITED:
                return '#FFB533';
            case _CURRENT:
                return '#E3FF33'; //#ff0000'; 
            case _OBSTACLE:
                return 'black';
            case _START:
                return 'red';
            case _END:
                return 'red';
            default:
                return '#ffffe6';
        }
    }
}