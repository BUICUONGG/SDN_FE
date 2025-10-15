import React from 'react'
import img1 from '../../img/EXE/3.png'
import th1 from "../../img/ima/Frame 28437-9f1c3961.png";
import th2 from "../../img/ima/Frame 28440-c86753d5.jpg";
import th3 from "../../img/ima/Frame 28441-b2f38279.png";
import th4 from "../../img/ima/Frame 28444-a5f95ab5.jpg";
import th5 from "../../img/ima/banana republic-9e06b026.jpg";
import th6 from "../../img/ima/nike-6831b575.png";

export default function HotProduct() {
    const data = [
        { key: 1, context: 'Nike', img: th1 },
        { key: 2, context: 'Nike', img: th2 },
        { key: 3, context: 'Nike', img: th3 },
        { key: 4, context: 'Nike', img: th4 },
        { key: 5, context: 'Nike', img: th5 },
        { key: 6, context: 'Nike', img: th6 }
    ];

    return (
        <div
            className="container-fluid py-3"
            style={{
                paddingLeft: '5%',
                paddingRight: '5%',
                marginBottom: '6%',
            }}
        >
            <div className="row justify-content-between">
                {data.map((item) => (
                    <div
                        key={item.key}
                        className="col-12 col-md-6 col-lg-2 mb-4"
                    >
                        <img
                            src={item.img}
                            alt={item.context}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        
                    </div>
                ))}
            </div>
        </div>
    );
}
