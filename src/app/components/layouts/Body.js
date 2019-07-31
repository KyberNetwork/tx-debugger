import React  from 'react';

export default function Body() {
  return (
    <div className={"body"}>
      <div className={"container"}>
        <div className={"body__container"}>
          <div className={"body__box body__debug"}>
            <div className={"body__box-header"}>Debug</div>
            <div className={"body__box-content"}>
              <div className={"body__debug-text"}>Debugging...</div>
              <div className={"body__debug-text"}>Checking Gas Limit...</div>
              <div className={"body__debug-text"}>Checking Gas Price...</div>
              <div className={"body__debug-text"}>Checking Minimum Rate...</div>
              <div className={"body__debug-text body__debug-text--green"}>Terminal is connected, will time out in 3012s</div>
            </div>
          </div>

          <div className={"body__box body__summary"}>
            <div className={"body__box-header"}>Bug Summary</div>
            <div className={"body__box-content"}>
              <div className={"body__box-item"}>
                <span className={"body__box-number"}>1</span>
                <span className={"body__box-bug"}>Aorem ipsum dolor sit amet, consectetur adipiscing elonsectetur adipisciit.</span>
              </div>
              <div className={"body__box-item"}>
                <span className={"body__box-number"}>2</span>
                <span className={"body__box-bug"}>Lorem ipsum dolor sitr adipisc adipiscing elit  adipisc  adipisc.</span>
              </div>
              <div className={"body__box-item"}>
                <span className={"body__box-number"}>3</span>
                <span className={"body__box-bug"}>Borem ipsum dolor sit amet, consectetur adipiscing elit.</span>
              </div>
              <div className={"body__box-item"}>
                <span className={"body__box-number"}>4</span>
                <span className={"body__box-bug"}>Yorem ipsum dolor sit amet, consectetur adit.</span>
              </div>
              <div className={"body__box-item"}>
                <span className={"body__box-number"}>5</span>
                <span className={"body__box-bug"}>Lorem ipsum dolor sit amet, consectetipiscing elit.</span>
              </div>
              <div className={"body__box-item"}>
                <span className={"body__box-number"}>6</span>
                <span className={"body__box-bug"}>Xorem ipsum d amet, consectetur adipiscing elit.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
