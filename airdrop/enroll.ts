import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

// Load Keypair
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create Connection
const connection = new Connection("https://api.devnet.solana.com");

// Github account as a buffer
const github = Buffer.from("0xRajvardhan", "utf8");

// Create Anchor Provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed"
});

// Create Program Instance
const program = new Program<Turbin3Prereq>(IDL, new PublicKey("Trb3aEx85DW1cEEvoqEaBkMn1tfmNEEEPaKzLSu4YAv"), provider);

// Derive PDA (Program Derived Address)
const [prereqPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("prereq"), keypair.publicKey.toBuffer()],
  program.programId
);

(async () => {
  try {
    const tx = await program.methods.complete(github).accounts({
      signer: keypair.publicKey,
      prereq: prereqPDA,
      systemAccount: new PublicKey("11111111111111111111111111111111") // System Program
    }).signers([keypair]).rpc();

    console.log("✅ Successfully enrolled! Transaction:", tx);
  } catch (error) {
    console.error("❌ Enrollment failed:", error);
  }
})();
