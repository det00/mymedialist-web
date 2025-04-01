import { Buscar } from "@/app/types";
import Image from "next/image";
import React from "react";

const ItemSearch = ({ imagen, titulo }: Buscar) => (
  <div className="item d-flex mb-3">
    <div className="col-2">
      {
        <Image
          width={100}
          height={120}
          src={imagen}
          alt=""
          className="rounded-4 img-fluid"
        />
      }
    </div>
    <div className="col-9">
      <div className="row">
        <h5>{titulo}</h5>
      </div>
      <div className="d-flex space-around align-items-end mt-3 gap-5">
        <div className="text-secondary">Sandbox</div>
        <div className="text-secondary">24/08/2036</div>
        <div className="text-secondary">Currently</div>
        <div className="text-secondary flex-grow-2">Downloaded</div>
        <div className="d-flex main-border-button border-no-active pt-4">
          <a href="#">Downloaded</a>
        </div>
      </div>
    </div>
  </div>
);
export default ItemSearch;
