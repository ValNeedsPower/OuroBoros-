import {ethers, providers, Signer, utils} from 'ethers';
import {errorCodes} from 'eth-rpc-errors'

import {
    Chain,
    EthereumProvider,
    MetamaskWindow,
    Network,
    NetworkConfig,
    ProviderRpcError,
    WalletEvents,
} from './types';
import {handleMultipleWalletExtensions, serializeChainId, serializeNetwork} from "./utils";
import {z} from "zod";
import {TypedEmitter} from 'tiny-typed-emitter';

export class MetamaskWallet extends TypedEmitter<WalletEvents> {
    public readonly name = 'metamask';
    private _chain: Chain = 'bsc';
    private readonly contracts = {
        MOCTOKEN: '0x4F0bB89a79F06A4f7daF6a399d80ce2912f00910',
        INVESTMENT: '0xFF18765da35E1E2b0e99ddA0b7cAaCb8ed26D07D',
        METASMART: '0xdFEE3b8261C3fC2cB226D7D2857F968b54553E99',
    }
    private readonly _networks: NetworkConfig = {
        bsc: {
            name: "Binance Smart Chain Testnet",
            symbol: 'BNB',
            rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            blockExplorerUrl: 'https://testnet.bscscan.com/',
        },
        eth: {
            name: "Ethereum Mainnet",
            symbol: 'GoerliETH',
            rpcUrl: "https://eth-goerli.g.alchemy.com/v2/Lu_oWw2AZJ9xd0oItEBFs-NDOUyfn9rL",
            chainId: 5,
            blockExplorerUrl: 'https://goerli.etherscan.io',
        }
    };
    public readonly instances = new Map<Chain, providers.Provider>();
    private _provider?: any;
    private _signer?: Signer;
    private _contractInterface = new utils.Interface([
        'function approve(address spender, uint256 amount) public virtual override returns (bool)',

        'function buyMSmartWithRef(uint256 _amount, string memory _referralCode) external',
        'function buyMSmart(uint256 _amount) public',
        'function isRefSetNotAllowed(address addr) public view returns (bool)',
        'function createReferralCode() external',
        'function referralCode(address addr) public view returns (string)',
        'function balanceOf(address addr) public view returns (uint256)',

        'function stake(uint8 _pool, uint256 _amount, uint256 _lockPeriod) external',

        'function previewRewards(address _user, uint8 _pool, uint256 _poolId) external view returns (uint256)',

        'function userTeam(address addr) public view returns (uint256, uint256)',
        'function poolTotalBalance(uint8 _pool) public view returns (uint256)',
        'function referralRewards(address addr) public view returns (uint256)',

        'function claim(uint8 _pool, uint256 _poolId) external',

        'function allowance(address owner, address spender) external view returns (uint256)',

        'event MSmartPurchased(address user, uint256 amount)'
    ]);
    public contractSubscriber: any;

    constructor() {
        super();
        this.setInstances(this._networks[this._chain]);
        this._provider = new ethers.providers.JsonRpcProvider(this._networks.bsc.rpcUrl);
    }

    private setInstances(network: Network) {
        const provider = new providers.JsonRpcProvider(network.rpcUrl);

        this.instances.set(this._chain, provider);
    }

    private getInjectedProvider() {
        // if (this._provider) {
        //     return this._provider;
        // }
        const win = window as MetamaskWindow;
        const metamaskProvider = win.ethereum && handleMultipleWalletExtensions(win.ethereum, p => p.isMetaMask);

        if (
            !win.ethereum ||
            !win.ethereum.isMetaMask ||
            typeof win.ethereum.request !== 'function' ||
            !metamaskProvider
        ) {
            throw new ProviderRpcError(errorCodes.provider.unsupportedMethod, 'Not install extension')
        }

        this._provider = metamaskProvider;
        return metamaskProvider;
    }

    public async connect() {
        const provider = this.getInjectedProvider();

        await provider.request?.({method: 'eth_requestAccounts'});
        await this.getSigner(this._chain)
        await localStorage.setItem('wallet', this.name)
    }

   


    public async disconnect() {
        this._provider?.removeAllListeners?.();
    }

    public async checkConnection() {
        console.log(this._provider, this._signer, this._signer)
    }

    public async getSigner(chain: Chain): Promise<Signer | undefined> {
        if (
            this._chain &&
            this._signer &&
            this._networks[chain].chainId === this._networks[this._chain].chainId
        ) {
            return this._signer;
        }

        const network = this._networks[chain];
        const provider = this.getInjectedProvider();

        try {
            await provider.request?.({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: serializeChainId(network.chainId)}],
            });
        } catch (err: unknown) {
            if (z.object({code: z.number()}).parse(err).code !== 4902) {
                throw err;
            }

            await provider.request?.({
                method: 'wallet_addEthereumChain',
                params: [serializeNetwork(network)],
            });
        }

        this._signer = new providers.Web3Provider(provider).getSigner();
        this._chain = chain;
        return this._signer;
    }

    public getAddr() {
        return this._signer?.getAddress()
    }


   

    

    public async getTokenBalance() {
        const contract = new ethers.Contract(this.contracts.MOCTOKEN, this._contractInterface, this._signer)
        
        try {
            return await contract.balanceOf(this.getAddr())
        } catch (e) {
            console.log(e)
        }
    }

    public async getMSTokenBalance() {
        const contract = new ethers.Contract(this.contracts.METASMART, this._contractInterface, this._signer)
        
        try {
            return await contract.balanceOf(this.getAddr())
        } catch (e) {
            console.log(e)
        }
    }

    public async getTeamInfo() {
        const contract = new ethers.Contract(this.contracts.INVESTMENT, this._contractInterface, this._signer)

        try {
            return await contract.userTeam(this.getAddr())
        } catch (e) {
            console.log(e)
        }
    }

    public async getReferralRewards() {
        const contract = new ethers.Contract(this.contracts.INVESTMENT, this._contractInterface, this._signer)

        try {
            return await contract.referralRewards(this.getAddr())
        } catch (e) {
            console.log(e)
        }
    }

    

   //BUY TOKENS FUNCTION FOR OUROBOROS + APPROVE

   public async buyToken(amount: string) {
    const investment = new ethers.Contract(this.contracts.INVESTMENT, this._contractInterface, this._signer);
  
   try {
    await investment.buyTokens(ethers.utils.parseEther(amount));
   } catch (e) {
     console.log(e);
   }
 }


  
  

    public async approveToken(amount: string) {
        const tokens = new ethers.Contract(this.contracts.MOCTOKEN, this._contractInterface, this._signer)
        try {
            const transaction = await tokens.approve(this.contracts.INVESTMENT, ethers.utils.parseEther(amount));

        } catch (e) {
            console.log(e)
        }
    } 

    public async getAllowance() {
        const tokens = new ethers.Contract(this.contracts.MOCTOKEN, this._contractInterface, this._signer)
        try {
            const result = await tokens.allowance(this.getAddr(), this.contracts.INVESTMENT);            
            return ethers.utils.formatEther(result).toString();
        } catch (e) {
            console.log("ERROR", e);
        }
    }}
