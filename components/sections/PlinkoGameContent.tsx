
import React, { useState, useEffect, useRef, useCallback } from 'react';

const BALL_RADIUS = 8;
const PEG_RADIUS = 5;
const NUM_PEG_ROWS = 10;
const MULTIPLIER_SLOTS_COUNT = NUM_PEG_ROWS + 1;

type RiskLevel = 'low' | 'medium' | 'high';

const MULTIPLIER_PROFILES: Record<RiskLevel, number[]> = {
  low:    [4,  2,  1, 0.5, 0.2, 0.2, 0.2, 0.5, 1,  2,  4],
  medium: [16, 9,  2, 0.2, 0.1, 0.5, 0.1, 0.2, 2,  9,  16],
  high:   [100, 15, 2, 0.2, 0, 0.1, 0, 0.2, 2, 15, 100], 
};

const INITIAL_USER_BALANCE = 1000;
const DEFAULT_BET_AMOUNT = 10;
const MIN_BET_AMOUNT = 1;

const PLINKO_USER_BALANCE_KEY = 'plinkoPhysicsGameUserBalance_v3_multi'; 

const GRAVITY = 0.15;
const PEG_BOUNCE_FACTOR_Y = 0.4;
const PEG_BOUNCE_FACTOR_X = 0.6;
const PEG_HORIZONTAL_INFLUENCE = 2.5;
const WALL_BOUNCE_FACTOR = 0.5;
const MAX_SPEED_Y = 8;
const MAX_SPEED_X = 6;
const BALL_RESET_DELAY = 3000; // 3 seconds


interface Peg {
  id: string;
  x: number;
  y: number;
}

interface MultiplierSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  color: string;
}

interface Ball {
  id: number; 
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
  settleTime: number;
  betAmountWhenDropped: number;
  landTimestamp?: number;
}

const PlinkoGameContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const [userBalance, setUserBalance] = useState(INITIAL_USER_BALANCE);
  const [betAmount, setBetAmount] = useState(DEFAULT_BET_AMOUNT.toString());
  const [message, setMessage] = useState<string>('');
  
  const [pegs, setPegs] = useState<Peg[]>([]);
  const [slots, setSlots] = useState<MultiplierSlot[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]); 
  const nextBallIdRef = useRef(0); 
  
  const initialPlinkoCanvasSize = { width: 380, height: 520 }; 
  const [canvasSize, setCanvasSize] = useState(initialPlinkoCanvasSize);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');
  
  const animationFrameIdRef = useRef<number | undefined>(undefined);

  const getMultiplierColor = useCallback((value: number, minValue: number, maxValue: number) => {
    const norm = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue); 
    const hue = (1 - norm) * 40 + norm * 0; 
    return `hsl(${hue}, 100%, 50%)`;
  }, []);

  const initializeBoard = useCallback(() => {
    if (!gameContainerRef.current) return;

    const parentWidth = gameContainerRef.current.clientWidth > 20 ? gameContainerRef.current.clientWidth - 20 : 300;
    const parentHeight = gameContainerRef.current.clientHeight > 200 ? gameContainerRef.current.clientHeight - 200 : 350;

    const newCanvasWidth = Math.max(320, Math.min(parentWidth, 500));
    const newCanvasHeight = Math.max(400, Math.min(parentHeight, 600));
    setCanvasSize({ width: newCanvasWidth, height: newCanvasHeight });

    const tempPegs: Peg[] = [];
    const topOffset = 60; 
    const rowHeight = (newCanvasHeight * 0.6) / NUM_PEG_ROWS; 

    for (let r = 0; r < NUM_PEG_ROWS; r++) {
      const pegsInRow = r + 2;
      const y = topOffset + r * rowHeight;
      const horizontalPegSpacing = newCanvasWidth / (pegsInRow + 1);
      for (let c = 0; c < pegsInRow; c++) {
        tempPegs.push({
          id: `peg-${r}-${c}`,
          x: (c + 1) * horizontalPegSpacing,
          y: y,
        });
      }
    }
    setPegs(tempPegs);

    const currentMultipliers = MULTIPLIER_PROFILES[riskLevel];
    const tempSlots: MultiplierSlot[] = [];
    const slotWidth = newCanvasWidth / MULTIPLIER_SLOTS_COUNT;
    const slotHeight = 40;
    const slotY = newCanvasHeight - slotHeight;
    const minMult = Math.min(...currentMultipliers.filter(m => m > 0)); 
    const maxMult = Math.max(...currentMultipliers);

    for (let i = 0; i < MULTIPLIER_SLOTS_COUNT; i++) {
      const value = currentMultipliers[i];
      tempSlots.push({
        id: `slot-${i}`,
        x: i * slotWidth,
        y: slotY,
        width: slotWidth,
        height: slotHeight,
        value: value,
        color: value > 0 ? getMultiplierColor(value, minMult, maxMult) : 'hsl(0, 0%, 30%)',
      });
    }
    setSlots(tempSlots);
  }, [getMultiplierColor, riskLevel]); 

  useEffect(() => {
    const storedBalance = localStorage.getItem(PLINKO_USER_BALANCE_KEY);
    if (storedBalance) {
      setUserBalance(parseFloat(storedBalance));
    }
  }, []);

  useEffect(() => {
    initializeBoard();
    const handleResize = () => initializeBoard();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeBoard, riskLevel]);


  useEffect(() => {
    localStorage.setItem(PLINKO_USER_BALANCE_KEY, userBalance.toString());
  }, [userBalance]);

  const handleBet = () => {
    const currentBet = parseFloat(betAmount);
    if (isNaN(currentBet) || currentBet < MIN_BET_AMOUNT) {
      setMessage(`Invalid bet amount. Min bet: ${MIN_BET_AMOUNT}.`);
      return;
    }
    if (currentBet > userBalance) {
      setMessage('Insufficient balance.');
      return;
    }
    
    setUserBalance(prev => prev - currentBet);
    setMessage('Ball dropped!');

    const newBall: Ball = {
      id: nextBallIdRef.current++,
      x: canvasSize.width / 2 + (Math.random() - 0.5) * 5,
      y: 20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 1,
      radius: BALL_RADIUS,
      active: true,
      settleTime: 0,
      betAmountWhenDropped: currentBet,
    };
    setBalls(prevBalls => [...prevBalls, newBall]);
  };

  const animateBalls = useCallback(() => {
    setBalls(prevBalls => {
      const updatedBalls = prevBalls.map(currentBall => {
        if (!currentBall.active) return currentBall;

        const nextBallState: Ball = { ...currentBall };

        nextBallState.vy += GRAVITY;
        nextBallState.vy = Math.min(nextBallState.vy, MAX_SPEED_Y);

        let tentativeX = nextBallState.x + nextBallState.vx;
        let tentativeY = nextBallState.y + nextBallState.vy;

        const slotRegionTopY = slots.length > 0 ? slots[0].y : canvasSize.height;

        if (tentativeX - nextBallState.radius < 0) {
          tentativeX = nextBallState.radius;
          nextBallState.vx = -nextBallState.vx * WALL_BOUNCE_FACTOR;
        } else if (tentativeX + nextBallState.radius > canvasSize.width) {
          tentativeX = canvasSize.width - nextBallState.radius;
          nextBallState.vx = -nextBallState.vx * WALL_BOUNCE_FACTOR;
        }
        nextBallState.x = tentativeX;

        if (tentativeY + nextBallState.radius < slotRegionTopY) {
          pegs.forEach(peg => {
            const distSq = (nextBallState.x - peg.x) ** 2 + (tentativeY - peg.y) ** 2;
            const combinedRadiusSq = (nextBallState.radius + PEG_RADIUS) ** 2;

            if (distSq < combinedRadiusSq) {
              const dist = Math.sqrt(distSq);
              const overlap = (nextBallState.radius + PEG_RADIUS) - dist;
              const dNx = (nextBallState.x - peg.x) / dist;
              const dNy = (tentativeY - peg.y) / dist;

              tentativeY += dNy * overlap * 0.8;
              nextBallState.x += dNx * overlap * 0.2; 

              const rvx_peg = nextBallState.vx;
              const rvy_peg = nextBallState.vy;

              let new_vy_peg = -rvy_peg * PEG_BOUNCE_FACTOR_Y;
              let horizontalNudge = (nextBallState.x - peg.x) * 0.05 * PEG_HORIZONTAL_INFLUENCE + (Math.random() - 0.5) * 0.5;
              let new_vx_peg = (rvx_peg * (1 - PEG_BOUNCE_FACTOR_X)) + horizontalNudge;
              
              if (Math.abs(new_vy_peg) < 0.1 && dNy !== 0) new_vy_peg = (dNy > 0 ? 0.5 : -0.5);

              nextBallState.vx = new_vx_peg;
              nextBallState.vy = new_vy_peg;
            }
          });
          nextBallState.y = tentativeY;
        } else {
          nextBallState.y = tentativeY;
        }

        nextBallState.vx = Math.max(-MAX_SPEED_X, Math.min(MAX_SPEED_X, nextBallState.vx));
        nextBallState.vy = Math.max(-MAX_SPEED_Y, Math.min(MAX_SPEED_Y, nextBallState.vy));

        if (nextBallState.active && nextBallState.y + nextBallState.radius >= slotRegionTopY && slots.length > 0) {
          let currentSlotIndex = -1;
          for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (nextBallState.x >= slot.x && nextBallState.x < slot.x + slot.width) {
              currentSlotIndex = i;
              break;
            }
          }

          if (currentSlotIndex !== -1) {
            const slot = slots[currentSlotIndex];
            nextBallState.vx = 0; 
            nextBallState.x = Math.max(slot.x + nextBallState.radius, Math.min(slot.x + slot.width - nextBallState.radius, nextBallState.x));

            if (nextBallState.y + nextBallState.radius >= canvasSize.height - nextBallState.radius / 4 ||
                (nextBallState.y + nextBallState.radius >= slot.y + slot.height - nextBallState.radius && Math.abs(nextBallState.vy) < 0.05) ||
                nextBallState.settleTime > 120
            ) {
              nextBallState.y = slot.y + slot.height - nextBallState.radius;
              nextBallState.vy = 0;
              nextBallState.active = false; 
              nextBallState.landTimestamp = Date.now();

              const landedMultiplier = slot.value;
              const winnings = nextBallState.betAmountWhenDropped * landedMultiplier;
              setUserBalance(prev => prev + winnings);
              setMessage(`Ball ID ${nextBallState.id}: ${landedMultiplier}x! Won: ${winnings.toFixed(2)}`);
            } else {
              nextBallState.settleTime += 1;
            }
          }
        } else if (nextBallState.active) { 
            nextBallState.settleTime = 0;
        }

        if (nextBallState.active && nextBallState.y - nextBallState.radius > canvasSize.height) {
          nextBallState.active = false;
          nextBallState.landTimestamp = Date.now();
          setMessage(`Ball ID ${nextBallState.id} lost! Multiplier: 0x`);
        }
        return nextBallState;
      });

      const ballsToKeep = updatedBalls.filter(ball => {
        if (!ball.active && ball.landTimestamp) {
          return (Date.now() - ball.landTimestamp) < BALL_RESET_DELAY;
        }
        return true;
      });

      if (ballsToKeep.some(b => b.active || (b.landTimestamp && Date.now() - (b.landTimestamp || 0) < BALL_RESET_DELAY))) {
        animationFrameIdRef.current = requestAnimationFrame(animateBalls);
      } else {
        animationFrameIdRef.current = undefined;
      }
      return ballsToKeep;
    });
  }, [canvasSize, pegs, slots, setUserBalance, setMessage]); 

  useEffect(() => {
    const shouldBeAnimating = balls.some(b => b.active || (b.landTimestamp && (Date.now() - (b.landTimestamp || 0)) < BALL_RESET_DELAY));
    
    if (shouldBeAnimating && !animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(animateBalls);
    }
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = undefined;
      }
    };
  }, [balls, animateBalls]); 


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    ctx.fillStyle = '#0f172a'; 
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.fillStyle = '#64748b'; 
    pegs.forEach(peg => {
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    });

    slots.forEach(slot => {
      ctx.fillStyle = slot.color;
      ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      ctx.fillStyle = '#FFFFFF'; 
      ctx.font = `bold ${Math.min(16, slot.width / 3.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(slot.value.toString() + 'x', slot.x + slot.width / 2, slot.y + slot.height / 2);
    });

    balls.forEach(ball => {
      ctx.fillStyle = '#38bdf8'; 
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [balls, pegs, slots, canvasSize]);

  const controlButtonClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed";
  const betButtonClass = `bg-green-500 hover:bg-green-600 text-white font-bold ${controlButtonClass}`;
  const inputClass = "px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100 w-24 text-center";
  
  const currentBetValue = parseFloat(betAmount);
  const isBetButtonDisabled = isNaN(currentBetValue) || currentBetValue < MIN_BET_AMOUNT || currentBetValue > userBalance;
  const anyBallActive = balls.some(b => b.active);

  return (
    <div ref={gameContainerRef} className="flex flex-col items-center justify-start h-full w-full p-2 bg-slate-800 text-slate-200 focus:outline-none" tabIndex={-1}>
      <div className="w-full max-w-md mb-2 p-2 bg-slate-700/50 rounded-md shadow">
        <div className="flex justify-around items-center text-center mb-3">
          <div>
            <label htmlFor="betAmountInputPlinko" className="block text-xs text-slate-400 mb-1">Bet Amount</label>
            <input 
              type="number" 
              id="betAmountInputPlinko"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min={MIN_BET_AMOUNT.toString()}
              className={inputClass}
            />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Balance</p>
            <p className="text-lg font-semibold text-sky-300">{userBalance.toFixed(2)}</p>
          </div>
        </div>
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1 text-center">Risk Level:</p>
          <div className="flex justify-center space-x-2">
            {(['low', 'medium', 'high'] as RiskLevel[]).map(level => (
              <button
                key={level}
                onClick={() => { if(!anyBallActive) setRiskLevel(level); }}
                disabled={anyBallActive}
                className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-700 focus:ring-sky-400
                  ${riskLevel === level ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}
                  disabled:opacity-60 disabled:cursor-not-allowed`}
                aria-pressed={riskLevel === level}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleBet} disabled={isBetButtonDisabled} className={`${betButtonClass} w-full`}>
          Place Bet
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-slate-600 rounded shadow-md bg-os-desktop"
        aria-label="Plinko game board"
      />
      
      {message && <p className="mt-2 text-sm text-sky-300 h-5 text-center w-full max-w-md truncate" title={message}>{message}</p>}
      {!message && <div className="mt-2 h-5"></div>} 

      <p className="text-xs text-slate-500 mt-1">
        Balls disappear 3s after landing.
      </p>
    </div>
  );
};

export default PlinkoGameContent;