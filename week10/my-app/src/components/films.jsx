import React from 'react';
import Film from './film'

class Films extends React.Component{
    constructor(props){
        super(props)
        this.state = { results: []}
    }

    async componentDidMount(){
        let url = "http://localhost/week6/part2/api/films"
        
        if(this.props.actorid !== undefined) url += `?actor_id=${this.props.actorid}`
        else if(this.props.filmid !== undefined) url += `?id=${this.props.filmid}`

        try{
            let res = await fetch(url)
            let data = await res.json()
            if(data.status !== 200) throw new Error(`API Error: ${data.status} | ${data.message} | ${url}`)
            this.setState({results: data.results}) 
        }catch(e){
            console.log("Something went wrong", e)
        }
    }
    render(){
        let filterFunctions = []

        if (this.props.search !== "" && this.props.search !== undefined) filterFunctions.push( (film) => {return film.title.toLowerCase().includes(this.props.search.toLowerCase()) || film.description.toLowerCase().includes(this.props.search.toLowerCase())})
        if(this.props.language !== "" && this.props.language !== undefined) filterFunctions.push( (film) => {return film.language === this.props.language || this.props.language === ""})

        let filteredResults = this.state.results

        filterFunctions.forEach(func => {
            filteredResults = filteredResults.filter(func)
        })

        let buttons = ""
        if(this.props.page !== undefined){
            let pageSize = this.props.pageSize || 10;
            let pageMax = this.props.page * pageSize;
            let pageMin = pageMax - pageSize
            buttons = (
                <div>
                    <button onClick={this.props.handlePreviousClick} disabled={this.props.page <= 1}>Previous</button>
                    <button onClick={this.props.handleNextClick} disabled={this.props.page >= Math.ceil(filteredResults.length / pageSize)}>Next</button>
                    <p>Page {this.props.page} of {Math.ceil(filteredResults.length/pageSize)}</p>
                </div>
            )
            filteredResults = filteredResults.slice(pageMin, pageMax)
        }

        let noData = ""
        if(!this.state.results.length || !filteredResults.length) noData = <p>No Data</p>
        return(
            <div>
                {noData}
                {filteredResults.map( (film, i) => (<Film key={`${i}:${film.title}`}film={film}/>))}
                {buttons}
            </div>
        )
    }
}

export default Films