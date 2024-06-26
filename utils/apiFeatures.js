class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){

        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields']; 
        excludedFields.forEach(el => { delete queryObj[el]});

        // 1B) Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){

        if(this.queryString.sort){
            const querySort = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(querySort);
            
        }else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    fields(){
        
        if(this.queryString.fields){
            const queryFields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(queryFields);
        }else{
            this.query = this.query.select('-__v');
        }

        return this;
    }

    pagination(){

                // 4) Pagination
                const page = this.queryString.page * 1 || 1;
                const limit = this.queryString.limit * 1 || 100;
                const skip = (page - 1) * limit;
        
                this.query = this.query.skip(skip).limit(limit);

                return this;
    }
}


module.exports = APIFeatures;