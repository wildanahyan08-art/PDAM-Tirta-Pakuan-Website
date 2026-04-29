"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export default function Pay(){
    /** this state for handling display of dialog */
    const [isOpenDialog, setIsOpenDialog] = 
        useState<boolean>(false)

    function openDialog(){
        setIsOpenDialog(true)
    }
    
    return (
        <div>
            <Button 
            type="button" onClick={() => openDialog()}
            className="bg-blue-50 text-blue-500 border-blue-500">
                Pay
            </Button>

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogHeader>
                    <DialogContent>
                    <DialogTitle>
                        Bill Payment
                    </DialogTitle>
                    <DialogDescription>
                        You have to ensure that you upload payment proof correctly
                    </DialogDescription>
                        <form>
                             
                        </form>
                    </DialogContent>
                </DialogHeader>
            </Dialog>
        </div>
    )
}