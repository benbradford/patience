import * as React from 'react'
import './Cards.css'
import {card_image} from './CardImages'
import {Suit, Face} from '../Model/Cards/Card'

export default class CardtableView extends React.Component<{}, {}>{

    public render() {  
        
        return (
            <p>
                
                {this.render_pile()}

            </p>
        );
    }

    private render_pile() : any {
        return (
            <table className="PileTable"> 
             <tr className="PileTR">
                <section style={this.piled_style(Suit.spades, Face.ace)}/>
             </tr>
             <tr className="PileTR">
                <section style={this.piled_style(Suit.hearts, Face.jack)}/>
             </tr>
             <tr className="PileTR">
                <section style={this.piled_style(Suit.clubs, Face.ten)}/>
             </tr>
             <tr className="PileTR">
                <section style={this.front_style(Suit.diamonds, Face.queen)} />
             </tr>
            </table>
        )
    }

    private piled_style(s : Suit, f : Face) {
        const img = card_image(s, f);  
        return {
            width: "150px",
            height: "70px",
            backgroundSize: "150px 200px",
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0"
          };     
    }

    private front_style(s : Suit, f : Face) {

        const img = card_image(s, f);  
        return {
            width: "150px",
            height: "200px",
            backgroundSize: "150px 200px",
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0"
          };     
    }
}