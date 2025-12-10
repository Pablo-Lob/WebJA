import React from 'react';
import './Branches.css';
import { Building2, Globe} from 'lucide-react'; // Asegúrate de tener lucide-react instalado

const Branches = () => {
    return (
        <section id="branches" className="branches-section">
            <div className="branches-container">

                {/* Título de la sección */}
                <div className="branches-header">
                    <h2>Branches</h2>
                    <div className="gold-divider"></div>
                    <p className="branches-subtitle">Connecting the world to the finest resources</p>
                </div>

                <div className="branches-grid">

                    {/* Tarjeta 1: Dubai HQ */}
                    <div className="branch-card">
                        <div className="icon-wrapper">
                            <Building2 size={40} />
                        </div>
                        <h3>Headquarters</h3>
                        <h4>Dubai, UAE</h4>
                        <p>
                            Located in the strategic hub of Dubai, ITS Stones serves as your exclusive gateway
                            to the world's most exquisite precious metals.
                        </p>
                    </div>

                    {/* Tarjeta 2: Sourcing */}
                    <div className="branch-card">
                        <div className="icon-wrapper">
                            <Globe size={40} />
                        </div>
                        <h3>Global Sourcing</h3>
                        <h4>Africa & South America</h4>
                        <p>
                            Directly sourced from verified mines across the richest geological regions of
                            Africa and South America, ensuring ethical provenance.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Branches;