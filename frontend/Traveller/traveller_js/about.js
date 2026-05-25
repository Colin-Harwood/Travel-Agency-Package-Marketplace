document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    
    var faqQuestions = document.querySelectorAll('.faq-question');
    
    function toggleAccordion() {
        var faqItem = this.parentElement;
        var answer = faqItem.querySelector('.faq-answer');
        var isActive = faqItem.classList.contains('active');
        var icon = this.querySelector('.faq-icon');
        
        var allFaqItems = document.querySelectorAll('.faq-item');
        
        for (var j = 0; j < allFaqItems.length; j++) {
            if (allFaqItems[j] !== faqItem) {
                allFaqItems[j].classList.remove('active');
                var otherAnswer = allFaqItems[j].querySelector('.faq-answer');
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
                var otherIcon = allFaqItems[j].querySelector('.faq-icon');
                if (otherIcon) {
                    otherIcon.textContent = '+';
                }
            }
        }
        
        if (!isActive) {
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
            if (icon) {
                icon.textContent = 'x';
            }
        } else {
            faqItem.classList.remove('active');
            answer.style.maxHeight = null;
            if (icon) {
                icon.textContent = '+';
            }
        }
    }
    
    for (var i = 0; i < faqQuestions.length; i++) {
        faqQuestions[i].addEventListener('click', toggleAccordion);
    }
    
    for (var k = 0; k < faqQuestions.length; k++) {
        faqQuestions[k].addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        faqQuestions[k].setAttribute('aria-expanded', 'false');
        faqQuestions[k].setAttribute('aria-label', 'Toggle FAQ answer');
        
        var parentItem = faqQuestions[k].parentElement;
        var answerContent = parentItem.querySelector('.faq-answer');
        if (answerContent) {
            answerContent.setAttribute('aria-hidden', 'true');
        }
    }
    
    function updateAriaAttributes() {
        var allItems = document.querySelectorAll('.faq-item');
        for (var m = 0; m < allItems.length; m++) {
            var btn = allItems[m].querySelector('.faq-question');
            var answerDiv = allItems[m].querySelector('.faq-answer');
            var isExpanded = allItems[m].classList.contains('active');
            
            if (btn) {
                btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            }
            if (answerDiv) {
                answerDiv.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
            }
        }
    }
    
    var originalToggle = toggleAccordion;
    window.toggleAccordion = function() {
        originalToggle.apply(this, arguments);
        updateAriaAttributes();
    };
    
    for (var n = 0; n < faqQuestions.length; n++) {
        var oldListener = faqQuestions[n];
        var newButton = oldListener.cloneNode(true);
        oldListener.parentNode.replaceChild(newButton, oldListener);
        
        newButton.addEventListener('click', function(e) {
            var faqItem = this.parentElement;
            var answer = faqItem.querySelector('.faq-answer');
            var isActive = faqItem.classList.contains('active');
            var icon = this.querySelector('.faq-icon');
            
            var allFaqItems = document.querySelectorAll('.faq-item');
            for (var j = 0; j < allFaqItems.length; j++) {
                if (allFaqItems[j] !== faqItem) {
                    allFaqItems[j].classList.remove('active');
                    var otherAnswer = allFaqItems[j].querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                    var otherIcon = allFaqItems[j].querySelector('.faq-icon');
                    if (otherIcon) {
                        otherIcon.textContent = '+';
                    }
                    var otherBtn = allFaqItems[j].querySelector('.faq-question');
                    if (otherBtn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }
                    var otherAnsDiv = allFaqItems[j].querySelector('.faq-answer');
                    if (otherAnsDiv) {
                        otherAnsDiv.setAttribute('aria-hidden', 'true');
                    }
                }
            }
            
            if (!isActive) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                if (icon) {
                    icon.textContent = 'x';
                }
                this.setAttribute('aria-expanded', 'true');
                if (answer) {
                    answer.setAttribute('aria-hidden', 'false');
                }
            } else {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
                if (icon) {
                    icon.textContent = '+';
                }
                this.setAttribute('aria-expanded', 'false');
                if (answer) {
                    answer.setAttribute('aria-hidden', 'true');
                }
            }
        });
        
        newButton.setAttribute('aria-expanded', 'false');
        newButton.setAttribute('aria-label', 'Toggle FAQ answer');
        
        var parentContainer = newButton.parentElement;
        var answerContainer = parentContainer.querySelector('.faq-answer');
        if (answerContainer) {
            answerContainer.setAttribute('aria-hidden', 'true');
        }
    }

});